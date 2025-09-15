using System;

namespace Cookworm.Models
{
    public class Chef : BaseUser
    {
        public Chef(string id, string username, string email, string passwordHash)
            : base(id, username, email, passwordHash) { }

        public void FeatureRecipe(string recipe)
        {
            Console.WriteLine($"{Username} featured a recipe: {recipe}");
        }
    }
}
