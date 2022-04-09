using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Dtos.Users
{
    public record CreateUserDto(string SpotifyUniqueIdentifier, string YoutubeUniqueIdentifier, string DeezerUniqueIdentifier, string SpotifyName, string YoutubeName, string DeezerName, string SpotifyEmail, string YoutubeEmail, string DeezerEmail);
}