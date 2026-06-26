-- Global-Source Africa — tighten public read access to the products table.
-- Apply after 0005.
--
-- WHY: the storefront only ever reads the buyer-safe `public_products` view and
-- `product_price_tiers`. But the raw `products` table had an anon SELECT policy
-- of `using (true)`, so anyone holding the public anon key (it ships in the
-- browser bundle) could query the table directly and read:
--   * supplier_id           — undercuts the "suppliers stay behind the brand" model
--   * approval_status / rejection_reason
--   * PENDING / REJECTED merchant submissions that are not yet live
-- This narrows the row policy so anon/authenticated only see APPROVED products.
-- The view (security_invoker) and the search RPC keep working because they only
-- ever surface approved rows anyway; service-role admin/merchant reads bypass RLS.

drop policy if exists products_read_public on products;
create policy products_read_public on products
  for select using (approval_status = 'approved');
