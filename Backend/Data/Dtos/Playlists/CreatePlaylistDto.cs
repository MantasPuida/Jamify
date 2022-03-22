using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Dtos.Playlists
{
    public record CreatePlaylistDto([Required] string PlaylistName, string PlaylistImage, string PlaylistDescription);
}
