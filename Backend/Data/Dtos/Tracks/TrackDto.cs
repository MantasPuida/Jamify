namespace Backend.Data.Dtos.Tracks
{
    public record TrackDto(Guid TrackId, string TrackName, string ImageUrl, string TrackDescription, string TrackSource);
}
