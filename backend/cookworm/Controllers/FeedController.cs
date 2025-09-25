using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FeedController : ControllerBase
{
    private readonly FeedService _feedService;

    public FeedController(FeedService feedService)
    {
        _feedService = feedService;
    }

    [HttpGet("/api/users/{username}/feed")]
    public async Task<IActionResult> GetFeed(string username)
    {
        var feed = await _feedService.GetFeedByUsernameAsync(username);
        return Ok(feed);
    }

}
