namespace Api.Entities
{
    public class Neuron
    {
        public Guid Id { get; set; }
        public string Label { get; set; } = string.Empty;
        public double X { get; set; }              // posição na tela (Hub / React Flow)
        public double Y { get; set; }
        public string Status { get; set; } = "alive";   // alive | evolving | dead
        public double FiringThreshold { get; set; }      // limiar de disparo (vem da pesquisa)
        public double Energy { get; set; }               // "vida"/energia do neurônio
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DiedAt { get; set; }

        // Navegações (1-N)
        public ICollection<NeuronLog> Logs { get; set; } = new List<NeuronLog>();
        public ICollection<BiologicalSignal> Signals { get; set; } = new List<BiologicalSignal>();

    }
}