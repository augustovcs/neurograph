namespace Api.Entities
{
    public class BiologicalSignal
    {
       public Guid Id { get; set; }
        public Guid NeuronId { get; set; }          // FK
<<<<<<< HEAD
        public Neuron Neuron { get; set; } = null!;
        public float Intensity { get; set; }
        public DateTime FiredAt { get; set; } = DateTime.UtcNow;
=======
        //public Neuron Neuron { get; set; } = null!;
        public float Intensity { get; set; }
        public DateTimeOffset FiredAt { get; set; } = DateTimeOffset.UtcNow;
>>>>>>> develop
    }
}