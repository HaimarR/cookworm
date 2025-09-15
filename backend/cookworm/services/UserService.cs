using System.Security.Cryptography;
using System.Text;

namespace Cookworm.Services
{
    using Cookworm.Models;
    public class UserService
    {
        // Temporary in-memory storage; later replace with DB
        private readonly List<BaseUser> _users = new List<BaseUser>();

        public BaseUser? SignUp(SignUpRequest request)
        {
            // Check duplicate email
            if (_users.Any(u => u.Email == request.Email))
            {
                Console.WriteLine("Email already in use.");
                return null;
            }

            // Hash password
            string hashedPassword = HashPassword(request.Password);

            // Create user
            var newUser = new BaseUser(
                Guid.NewGuid().ToString(),
                request.Username,
                request.Email,
                hashedPassword
            );

            _users.Add(newUser);

            // Return the user object
            return newUser;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // Optional: get user by email
        public BaseUser? GetByEmail(string email)
        {
            return _users.FirstOrDefault(u => u.Email == email);
        }
    }
}
