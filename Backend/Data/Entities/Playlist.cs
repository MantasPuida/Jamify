namespace Backend.Data.Entities
{
    public enum PlaylistType { Spotify, Youtube, Deezer }

    public class Playlist
    {
        public Guid PlaylistId { get; set; }
        public string PlaylistName { get; set; }
        public string PlaylistImage { get; set; }
        public string PlaylistDescription { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
