using System;

namespace Cookworm.Models
{
    public class Admin : BaseUser
    {
        public Admin(string id, string username, string email, string passwordHash)
            : base(id, username, email, passwordHash) { }

        public void ManageUser(User user)
        {
            Console.WriteLine($"{Username} is managing user: {user.Username}");
        }

        public void ApprovePost(string post)
        {
            Console.WriteLine($"{Username} approved the post: {post}");
        }
    }
}
