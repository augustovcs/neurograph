namespace Api.Entities
{
    public class BiologicalSignal
    {
       public Guid Id { get; set; }
        public Guid NeuronId { get; set; }          // FK
        //public Neuron Neuron { get; set; } = null!;
        public float Intensity { get; set; }
        public DateTimeOffset FiredAt { get; set; } = DateTimeOffset.UtcNow;
    }
}