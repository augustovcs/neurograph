using NeuroGraph.Main.Dtos;

namespace NeuroGraph.Main.Interfaces
{
    public interface ISimulationConfigService
    {
        /// Lê a configuração da simulação (linha única; cria com defaults se não existir).
        Task<SimulationConfigDto> GetConfigAsync();

        /// Substitui todos os parâmetros da configuração e devolve a config atualizada.
        Task<SimulationConfigDto> UpdateConfigAsync(SimulationConfigDto dto);

        /// Ajusta um parâmetro (identificado por <paramref name="key"/>) e devolve a config inteira.
        Task<SimulationConfigDto> AdjustSimulationConfig(string key, ConfigParameterDto value);
    }
}
