namespace NeuroGraph.Main.Interfaces
{
    public interface INeuronResetService
    {
        Task ResetAllAsync();
        Task ResetNeuronAsync(Guid neuronId);
    }
}

    
