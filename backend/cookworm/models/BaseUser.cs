using System;

namespace Cookworm.Models
{
    public class BaseUser : User
    {
        public BaseUser(string id, string username, string email, string passwordHash)
            : base(id, username, email, passwordHash) { }

        public override void ViewProfile()
        {
            Console.WriteLine($"Username: {Username}, Email: {Email}");
        }

        public void PostRecipe(string recipe)
        {
            Console.WriteLine($"{Username} posted a recipe: {recipe}");
        }
    }
}
