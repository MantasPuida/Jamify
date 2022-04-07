namespace Backend.Data.Entities
{
    public class User
    {
        public Guid UserId { get; set; }
        public string SpotifyUniqueIdentifier { get; set; }
        public string YoutubeUniqueIdentifier { get; set; }
        public string DeezerUniqueIdentifier { get; set; }
        public string SpotifyName { get; set; }
        public string YoutubeName { get; set; }
        public string DeezerName { get; set; }
        public string SpotifyEmail { get; set; }
        public string YoutubeEmail { get; set; }
        public string DeezerEmail { get; set; }
    }
}
