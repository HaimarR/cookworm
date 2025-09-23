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
            if (string.IsNullOrWhiteSpace(username))
                return new List<UserResponse>();

            return [.. _context.Users
                .Where(u => u.Username.Contains(username))
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Bio = u.Bio,
                    Location = u.Location,
                    Followers = 0 // placeholder
                })
                .Take(10)];
        }



        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
