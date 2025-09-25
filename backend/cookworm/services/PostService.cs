using Cookworm.Models;
using Cookworm.Data;
using Microsoft.EntityFrameworkCore;

public class PostService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public PostService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task<Post> CreatePostAsync(Guid userId, string caption, IFormFileCollection photos)
    {
        string? imageUrl = null;

        if (photos != null && photos.Count > 0)
        {
            // ✅ make sure we have a root path (fallback if WebRootPath is null)
            var rootPath = _env.WebRootPath;
            if (string.IsNullOrEmpty(rootPath))
            {
                rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var uploadsPath = Path.Combine(rootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);

            // ✅ handle multiple photos, but save the first one in posts table
            var file = photos[0];
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // store relative path so it works in frontend
            imageUrl = $"/uploads/{fileName}";
        }

        var post = new Post
        {
            UserId = userId,
            Caption = caption,
            ImageUrl = imageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return post;
    }

    public async Task<Post?> GetPostByIdAsync(int id)
    {
        return await _context.Posts.FindAsync(id);
    }

    public async Task<IEnumerable<object>> GetPostsByUsernameAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Enumerable.Empty<object>();

        var posts = await _context.Posts
            .Where(p => p.UserId == user.Id)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new 
            {
                p.Id,
                p.Caption,
                p.ImageUrl,
                p.CreatedAt,
                Username = user.Username
            })
            .ToListAsync();

        return posts;
    }
}
