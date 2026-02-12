import clsx from 'clsx'

export function Logomark(props: React.ComponentPropsWithoutRef<'div'>) {
  const { className, ...restProps } = props
  return (
    <div
      className={clsx('flex items-center gap-2.5', className)}
      style={{ display: 'flex', flexDirection: 'row' }}
      {...restProps}
    >
      <div className="relative h-9 w-9 flex-shrink-0">
        <img
          src="/logo.svg"
          alt=""
          width={36}
          height={36}
          className="h-full w-full opacity-0"
          style={{
            objectFit: 'contain',
          }}
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-indigo-400 dark:from-indigo-200 via-sky-400 to-indigo-300 dark:to-indigo-200"
          style={{
            WebkitMaskImage: 'url(/logo.svg)',
            maskImage: 'url(/logo.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      </div>
      <span className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
        Netlytics
      </span>
    </div>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  const { className, ...restProps } = props
  return (
    <div
      className={clsx('flex items-center gap-3', className)}
      style={{ display: 'flex', flexDirection: 'row' }}
      {...restProps}
    >
      <div className="relative h-9 w-9 flex-shrink-0">
        <img
          src="/logo.svg"
          alt=""
          width={36}
          height={36}
          className="h-full w-full opacity-0"
          style={{
            objectFit: 'contain',
          }}
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-indigo-400 dark:from-indigo-200 via-sky-400 to-indigo-300 dark:to-indigo-200"
          style={{
            WebkitMaskImage: 'url(/logo.svg)',
            maskImage: 'url(/logo.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      </div>
      <span className="text-xl font-medium uppercase tracking-widest text-slate-900 dark:text-slate-100 whitespace-nowrap -mb-1">
        Netlytics
      </span>
    </div>
  )
}
