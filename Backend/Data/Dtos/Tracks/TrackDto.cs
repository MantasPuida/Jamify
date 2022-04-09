namespace Backend.Data.Dtos.Tracks
{
    public record TrackDto(Guid TrackId, string TrackName, string ImageUrl, string Artists, string Duration, string Album);
}
