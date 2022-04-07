namespace Backend.Data.Dtos.Users
{
    public record UpdateUserDto(string SpotifyUniqueIdentifier, string YoutubeUniqueIdentifier, string DeezerUniqueIdentifier, string SpotifyName, string YoutubeName, string DeezerName, string SpotifyEmail, string YoutubeEmail, string DeezerEmail);
}
