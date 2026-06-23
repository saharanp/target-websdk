#!/usr/bin/env bash
# Verify that Unsplash photo URLs return HTTP 200 + image/* content-type.
# Usage: bash tools/verify-image-urls.sh <ids-file>
# ids-file: one photo id per line (the "photo-..." token), # to comment.

set -u
IDS_FILE="${1:-tools/photo-ids.txt}"
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
URL_TPL='https://images.unsplash.com/PHOTO?auto=format&fit=crop&w=600&q=80'

pass=0
fail=0
fail_ids=()

printf "%-46s | %-3s | %s\n" "photo id" "HTTP" "content-type"
printf -- "---------------------------------------------+-----+--------------------\n"

while IFS= read -r raw; do
  id="${raw%%#*}"
  id="${id// /}"
  [ -z "$id" ] && continue
  url="${URL_TPL/PHOTO/$id}"
  hdr=$(curl -sI -A "$UA" -m 12 "$url" 2>/dev/null)
  http=$(printf '%s' "$hdr" | head -n1 | awk '{print $2}')
  ct=$(printf '%s' "$hdr" | grep -i '^content-type:' | head -n1 | tr -d '\r' | sed 's/^[Cc]ontent-[Tt]ype:[[:space:]]*//')
  if [ "$http" = "200" ] && [[ "$ct" == image/* ]]; then
    pass=$((pass+1))
    status="OK"
  else
    fail=$((fail+1))
    fail_ids+=("$id")
    status="FAIL"
  fi
  printf "%-46s | %-3s | %s  %s\n" "$id" "${http:-???}" "${ct:-?}" "$status"
done < "$IDS_FILE"

echo ""
echo "PASS: $pass    FAIL: $fail"
if [ $fail -gt 0 ]; then
  echo "Failed ids:"
  printf '  %s\n' "${fail_ids[@]}"
  exit 1
fi
