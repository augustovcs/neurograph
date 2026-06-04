namespace Api.Entities
{
    public class NeuronLog
    {
       public Guid Id { get; set; }
       public Guid NeuronId { get; set; }
       public Neuron Neuron { get; set; }  // Navegação para o Neuron
       public string type { get; set; } = string.Empty;  // "firing", "energy_change", "status_change"
       public string? Details { get; set; }  // JSON ou string com detalhes do evento
       public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
    }
}