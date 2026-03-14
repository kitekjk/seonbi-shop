import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">선비샵</h3>
            <p className="mt-2 text-sm text-stone-500">
              한국 전통의 아름다움을 현대적으로 재해석한 기념품 쇼핑몰
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-navy">쇼핑 안내</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/products" className="text-sm text-stone-500 hover:text-brand-red">
                  전체 상품
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-stone-500 hover:text-brand-red">
                  이벤트
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-stone-500 hover:text-brand-red">
                  검색
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-navy">고객 지원</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-stone-500">이메일: cs@seonbishop.kr</li>
              <li className="text-sm text-stone-500">운영시간: 평일 10:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} 선비샵. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
