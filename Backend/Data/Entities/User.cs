namespace Backend.Data.Entities
{
    public class User
    {
        public Guid UserId { get; set; }
        public string SpotifyUniqueIdentifier { get; set; }
        public string YoutubeUniqueIdentifier { get; set; }
        public string DeezerUniqueIdentifier { get; set; }
    }
}
