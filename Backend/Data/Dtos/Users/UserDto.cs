namespace Backend.Data.Dtos.Users
{
    public record UserDto(Guid UserId, string SpotifyUniqueIdentifier, string YoutubeUniqueIdentifier, string DeezerUniqueIdentifier);
}
