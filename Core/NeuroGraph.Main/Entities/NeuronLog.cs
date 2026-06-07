using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Entities
{

    [Table("neurons_logs")]
    public class NeuronLog
{
    public Guid Id { get; set; }
    public Guid NeuronId { get; set; }
    public Neuron? Neuron { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // ← era Timestamp
    }
        
    
}