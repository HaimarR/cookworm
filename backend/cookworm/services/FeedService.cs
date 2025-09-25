using Cookworm.Models;
using Cookworm.Data;
using Microsoft.EntityFrameworkCore;

public class FeedService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public FeedService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }
    
    public async Task<IEnumerable<object>> GetFeedByUsernameAsync(string username)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null) return Enumerable.Empty<object>();

        // Get IDs of users this person follows
        var followingIds = await _context.Follows
            .Where(f => f.FollowerId == user.Id)
            .Select(f => f.FollowedId)
            .ToListAsync();

        // Include own posts too
        followingIds.Add(user.Id);

        // Get posts from followed users + self
        var feed = await _context.Posts
            .Where(p => followingIds.Contains(p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .Join(_context.Users,  // join for username
                p => p.UserId,
                u => u.Id,
                (p, u) => new {
                    p.Id,
                    p.Caption,
                    p.ImageUrl,
                    p.CreatedAt,
                    Username = u.Username
                })
            .ToListAsync();

        return feed;
    }


}
