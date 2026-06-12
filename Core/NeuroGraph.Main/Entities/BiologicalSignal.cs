namespace NeuroGraph.Main.Entities
{
    public class BiologicalSignal
    {
       public Guid Id { get; set; }
        public Guid NeuronId { get; set; }          // FK
        public Neuron Neuron { get; set; } = null!;
        public double Intensity { get; set; }
        public DateTime FiredAt { get; set; } = DateTime.UtcNow;
    }
}