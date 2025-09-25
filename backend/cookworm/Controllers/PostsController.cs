using Microsoft.AspNetCore.Mvc;
using Cookworm.Services;
using Cookworm.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;

    public PostsController(PostService postService)
    {
        _postService = postService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest request)
    {
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(sub))
        {
            Console.WriteLine("sub is empty");
            return Unauthorized("sub is empty");
        }

        if (!Guid.TryParse(sub, out var userId))
        {
            Console.WriteLine("sub is not guid");
            return Unauthorized("sub is not guid");
        }
            

        var post = await _postService.CreatePostAsync(userId, request.Caption, request.Photos);
        return Ok(post);
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpGet("/api/users/{username}/posts")]
    public async Task<IActionResult> GetUserPosts(string username)
    {
        var posts = await _postService.GetPostsByUsernameAsync(username);
        if (posts == null || !posts.Any()) return NotFound("No posts found for this user");

        return Ok(posts);
    }
}
