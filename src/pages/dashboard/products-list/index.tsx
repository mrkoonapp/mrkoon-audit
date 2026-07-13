import { CONFIG } from 'src/global-config';

import { ProductsListView } from 'src/sections/products-list/view';

// ----------------------------------------------------------------------

const metadata = { title: `Products | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProductsListView />
    </>
  );
}
