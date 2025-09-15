using System;

namespace Cookworm.Models
{
    public abstract class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }

        protected User(string id, string username, string email, string passwordHash)
        {
            Id = id;
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.Now;
        }

        public abstract void ViewProfile();
    }
}
