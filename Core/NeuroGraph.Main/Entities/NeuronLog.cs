using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Entities
{

    [Table("neurons_logs")]
    public class NeuronLog
    {
       public Guid Id { get; set; }
       public Guid NeuronId { get; set; }
       public Neuron? Neuron { get; set; }  // Navegação para o Neuron
       public string Type { get; set; } = string.Empty;  // "firing", "energy_change", "status_change"
       public string? Details { get; set; }  // JSON ou string com detalhes do evento
       public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    } 
    
}