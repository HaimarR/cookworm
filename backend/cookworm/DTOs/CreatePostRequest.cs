public class CreatePostRequest
{
    public string Caption { get; set; } = string.Empty;
    public IFormFileCollection Photos { get; set; } = default!;
}
