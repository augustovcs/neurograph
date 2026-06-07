namespace Neurograph.Services
{
    public interface INeuronBehaviorService
    {   
    Task RunTickAsync();   // processa UM ciclo de tempo para todos os neurônios
    }
}