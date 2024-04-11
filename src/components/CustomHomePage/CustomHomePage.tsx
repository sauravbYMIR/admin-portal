function CustomHomePage({
  heading,
  subHeading,
  children,
}: {
  heading: string;
  subHeading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-20">
      <div className="mb-[72px] flex flex-col gap-3 pl-[7px]">
        <h2 className="font-poppins text-4xl font-medium text-darkslategray">
          {heading}
        </h2>
        <p className="font-poppins text-base font-normal text-neutral-2">
          {subHeading}
        </p>
      </div>
      {children}
    </div>
  );
}

export { CustomHomePage };
