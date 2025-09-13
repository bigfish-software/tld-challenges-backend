$json = Get-Content 'c:\develop\BigFishSoftware\lab\tld-challenges-backend\test_submission.json' -Raw
$headers = @{
    'Authorization' = 'Bearer 820713c4482560bc16b8de78921188a4e223b662eacbe0b4edae4014d7f4a270affdad74d5808c10560efa95ae5dafb1cf5835c335c586848159dbadd76ef41b61ada5b4b12afc3bd9ccb62da044acb04f066e3affcbd98f6dea512e3db8cb5257ac926199403e02c6e39d184d59e2159577ff9dbf0a1f38d008dddc998b84d5'
    'Content-Type' = 'application/json'
}
$response = Invoke-WebRequest -Uri 'http://localhost:1337/api/submissions' -Headers $headers -Method POST -Body $json
Write-Host $response.Content