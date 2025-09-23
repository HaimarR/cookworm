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
                Location = user.Location
            };
        }

        public UserResponse? UpdateUser(Guid id, UserRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Username))
                user.Username = request.Username;

            if (request.Bio != null)
                user.Bio = request.Bio;

            if (request.Location != null)
                user.Location = request.Location;

            _context.SaveChanges();

            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                Location = user.Location
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
