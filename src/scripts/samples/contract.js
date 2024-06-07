export const counter = `\
(define-data-var count uint u0)
(define-data-var contract-owner principal tx-sender)
(define-data-var cost uint u10)

(define-read-only (get-count)
  (var-get count)
)

(define-public (increment)
  (begin
    (try! (stx-transfer? (var-get cost) tx-sender (var-get contract-owner)))
    (ok (var-set count (+ (var-get count) u1)))
  )
)
`;
