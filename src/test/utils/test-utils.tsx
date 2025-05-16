import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { DataProvider } from '../../services/DataProvider';
import { MockDataProvider } from '../MockDataProvider';
import { testConfig } from '../../config/testConfig';

// Create a context for the data provider
export const DataProviderContext = React.createContext<DataProvider | null>(null);

// Custom provider that exposes the data provider to components
export const DataProviderProvider: React.FC<{
  dataProvider: DataProvider;
  children: React.ReactNode;
}> = ({ dataProvider, children }) => {
  return (
    <DataProviderContext.Provider value={dataProvider}>
      {children}
    </DataProviderContext.Provider>
  );
};

// Custom hook to use the data provider
export function useDataProvider(): DataProvider {
  const context = React.useContext(DataProviderContext);
  if (context === null) {
    throw new Error('useDataProvider must be used within a DataProviderProvider');
  }
  return context;
}

// Custom render method that includes providers
export function customRender(
  ui: ReactElement,
  {
    dataProvider = new MockDataProvider(),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <DataProviderProvider dataProvider={dataProvider}>
        {children}
      </DataProviderProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Use our customRender everywhere instead of testing-library's render
export * from '@testing-library/react';
export { customRender as render };
