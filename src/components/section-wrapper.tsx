type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Plain section shell. It used to trigger its children's animations as one
 * block when 20% of it was visible, which made anything further down
 * animate off-screen; every reveal inside now watches its own visibility.
 */
export default function SectionWrapper({ children }: SectionWrapperProps) {
  return (
    <section className="bg-background relative overflow-hidden">
      {children}
    </section>
  );
}
