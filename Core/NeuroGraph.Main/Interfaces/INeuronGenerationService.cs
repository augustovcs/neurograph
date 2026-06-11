namespace NeuroGraph.Main.Interfaces;

public interface INeuronGenerationService
{
    public Task<bool> LowNeuronSpawn(int countNeurons);
}