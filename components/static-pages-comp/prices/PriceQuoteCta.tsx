import SharedRegistrationPanel, { type SharedRegistrationPanelVariant } from "@/components/static-pages-comp/shared/SharedRegistrationPanel";

/**
 * Compatibility adapter for non-preview pages that still import the former
 * Prices-named CTA. The implementation is the shared registration panel.
 */
export default function PriceQuoteCta({ variant = "default" }: { variant?: SharedRegistrationPanelVariant }) {
  return <SharedRegistrationPanel variant={variant} />;
}
