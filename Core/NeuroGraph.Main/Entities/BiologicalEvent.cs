namespace Api.Entities
{
    public class BiologicalEvent
    {
       public Guid Id { get; set; }
        public Guid NeuronId { get; set; }          // FK
        public string Kind { get; set; } = string.Empty;   // death | evolution
        public string? Cause { get; set; }                  // "energia esgotada", etc.
        public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    }
}