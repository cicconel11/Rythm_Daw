synth:  ## cdk synth
	@pnpm run cdk synth

diff:   ## cdk diff
	@pnpm run cdk diff

deploy: ## cdk deploy
	@pnpm run cdk deploy --require-approval never

destroy: ## cdk destroy
	@pnpm run cdk destroy --force 