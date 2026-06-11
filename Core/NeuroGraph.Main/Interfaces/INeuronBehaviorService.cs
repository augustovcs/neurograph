namespace NeuroGraph.Main.Interfaces;

    public interface INeuronBehaviorService
    {   
    Task RunTickAsync();   // processa UM ciclo de tempo para todos os neurônios
    }
