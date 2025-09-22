using Microsoft.EntityFrameworkCore;
using Cookworm.Models;

namespace Cookworm.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
    }
}