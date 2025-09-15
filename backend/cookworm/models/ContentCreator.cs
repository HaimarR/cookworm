using System;

namespace Cookworm.Models
{
    public class BaseContentCreator : BaseUser
    {
        public BaseContentCreator(string id, string username, string email, string passwordHash)
            : base(id, username, email, passwordHash) { }

        public void CreatePost(string content)
        {
            Console.WriteLine($"{Username} created a post: {content}");
        }

        public void DraftRecipe(string recipe)
        {
            Console.WriteLine($"{Username} drafted a recipe: {recipe}");
        }
    }
}
