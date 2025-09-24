using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Cookworm.Models;
using Cookworm.DTOs;
using Cookworm.Data;

namespace Cookworm.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public User? SignUp(SignUpRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return null;

            string hashedPassword = HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return newUser;
        }

        public UserResponse? GetUserById(Guid id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                Location = user.Location,
                Followers = 0 // placeholder for now
            };
        }

        public UserResponse? GetUserByUsername(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return null;

            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                Location = user.Location,
                Followers = 0
            };
        }

        public async Task<User?> GetByUsernameAsync(string username) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task<Guid?> GetIdByUsernameAsync(string username)
        {
            var user = await _context.Users
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefaultAsync();
            return user?.Id;
        }



        public User? UpdateUser(Guid id, UserRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            // Check username uniqueness
            if (!string.IsNullOrWhiteSpace(request.Username) &&
                _context.Users.Any(u => u.Username == request.Username && u.Id != id))
            {
                throw new Exception("Username already taken.");
            }

            // Check email uniqueness
            if (!string.IsNullOrWhiteSpace(request.Email) &&
                _context.Users.Any(u => u.Email == request.Email && u.Id != id))
            {
                throw new Exception("Email already in use.");
            }

            if (!string.IsNullOrWhiteSpace(request.Username))
                user.Username = request.Username;

            if (!string.IsNullOrWhiteSpace(request.Email))
                user.Email = request.Email;

            user.Bio = request.Bio ?? user.Bio;
            user.Location = request.Location ?? user.Location;

            _context.SaveChanges();
            return user;
        }

         public List<UserResponse> SearchUsers(string username)
        {
            var term = (username ?? string.Empty).Trim();

            // basic search by username (case-insensitive)
            var users = _context.Users
                .AsNoTracking()
                .Where(u => EF.Functions.ILike(u.Username, $"%{term}%"))
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Bio = u.Bio,
                    Location = u.Location,
                    // Email intentionally omitted for public search
                })
                .ToList();

            if (users.Count == 0) return users;

            var ids = users.Select(u => u.Id).ToList();

            // COUNT FOLLOWERS PER RETURNED USER -> group by FollowedId
            var followerCounts = _context.Follows
                .AsNoTracking()
                .Where(f => ids.Contains(f.FollowedId))
                .GroupBy(f => f.FollowedId)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.UserId, x => x.Count);

            foreach (var u in users)
                u.Followers = followerCounts.TryGetValue(u.Id, out var c) ? c : 0;

            return users;
        }



        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
