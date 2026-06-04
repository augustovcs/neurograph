namespace Api.Entities
{
    public class NeuralConnection
    {
       public Guid Id { get; set; }
        public Guid SourceNeuronId { get; set; }    // FK -> Neuron
        public Guid TargetNeuronId { get; set; }    // FK -> Neuron
        public double Weight { get; set; }          // força da sinapse (vem da pesquisa)
        public bool IsExcitatory { get; set; }      // excitatória x inibitória
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}