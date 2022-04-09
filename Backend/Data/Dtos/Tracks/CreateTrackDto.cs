using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Dtos.Tracks
{
    public record CreateTrackDto([Required] string TrackName, [Required] string ImageUrl, string Artists, string Duration, string Album);
}
