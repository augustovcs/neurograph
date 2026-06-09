namespace Interfaces;

public interface INeuronResetService
{
    public Task<bool> ResetNeurons ();
}