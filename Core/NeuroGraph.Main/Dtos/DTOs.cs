namespace NeuroGraph.Main.Dtos
{
    
        public record NeuronDto(Guid Id, string Label, double X, double Y, string Status, double Energy);
        public record ConnectionDto(Guid Id, Guid Source, Guid Target, double Weight, bool IsExcitatory);
        public record CreateNeuronDto(string Label, double X, double Y);
    
}