namespace Backend.Data.Entities
{
    public class Track
    {
        public Guid TrackId { get; set; }
        public string TrackName { get; set; }
        public string ImageUrl { get; set; }
        public string Artists { get; set; }
        public string Duration { get; set; }
        public string Album { get; set; }
        public Guid PlaylistId { get; set; }
        public Playlist Playlist { get; set; }
    }
}
