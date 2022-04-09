namespace Backend.Data.Dtos.Users
{
    public record UserDto(Guid UserId, string SpotifyUniqueIdentifier, string YoutubeUniqueIdentifier, string DeezerUniqueIdentifier, string SpotifyName, string YoutubeName, string DeezerName, string SpotifyEmail, string YoutubeEmail, string DeezerEmail);
}
